require 'rails_helper'

describe "Como um cadastrista", type: :feature, js: true do
  it "eu posso editar regiões" do
    visit root_path

    find("h1", :text => "Cadastro").click
    find("h5", :text => /^Regiões$/).click
    
    fill_in "regiao_nome", with: "REGIAO VELHA"
    click_button "Pesquisar"
    find(".regiao:last-child a").click

    fill_in "regiao_nome", with: "MINHA REGIAO"
    check "regiao_ativo"

    click_button "Salvar Região"

    expect(page).to have_content "Região atualizada com sucesso"

    fill_in "regiao_nome", with: "MINHA"

    click_button "Pesquisar"
    
    expect(page).to have_content "MINHA REGIAO"
  end
end